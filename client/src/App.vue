<template>

  <div v-if="!isConnected">
	  <div>
		  <input v-model="changeNameInput" type="text">
		  <button @click="handleNameChange">Change name</button>
	  </div>
    <h2>Rooms</h2>
    <div>
      <input v-model="createRoomInput" type="text">
      <button @click="handleCreateRoom">Create Room</button>
    </div>
    <ul v-if="rooms.length > 0">
      <li v-for="room of rooms">
        {{ room.name }} {{ room.roomId }} | {{ room.clients }} / {{ room.maxClients }}
        <button :data-room-id="room.roomId" @click="handleJoinRoom">Join</button>
      </li>
    </ul>
    <p v-else>No room available</p>
  </div>

  <div v-else>

	  <template v-if="state.started">

		  <p>Game start</p>

		  <div v-for="[id, player] of state.players">

			  <h3>{{id}} {{ player.name }}</h3>
			  <p>{{ player.golds }}</p>
			  <p>{{ player.points }}</p>
		  </div>

	  </template>
	  <template v-else>
	    <p>connected to room : {{connectedRoom.id}}</p>
	    <p>your id is : {{connectedRoom.sessionId}}</p>

	    <div>
	      <h2>Players</h2>
	      <div v-for="[id, player] of state.players">
	        <h3>{{ player.name }}</h3>
	        <p>Ready ? : {{ player.ready }}</p>
	        <button v-if="connectedRoom.sessionId === id" @click="handleReady">Ready {{player.ready ? '!' : '?'}}</button>
	      </div>
	    </div>
	  </template>


    <div>
      <ul v-if="state.chatMessages">
        <li v-for="message of state.chatMessages.toArray()" :key="message.id">
          <pre>{{ message.timestamp }} : {{ message.player.name }} : {{ message.message }}</pre>
        </li>
      </ul>
      <form @submit.prevent="handleSendChatMessage">
        <input v-model="chatMessageInput" type="text">
        <input type="submit" value="Send" />
      </form>
    </div>

  </div>
</template>

<script setup>
import * as Colyseus from "colyseus.js";
import {computed, onMounted, ref} from "vue";
import usePlayer from "./composables/usePlayer.js";

const {player: playerLocalStorageInfo} = usePlayer()

const client = new Colyseus.Client('ws://localhost:2567');
const rooms = ref([])
const createRoomInput = ref()
const chatMessageInput = ref()

const changeNameInput = ref(playerLocalStorageInfo.value.name)
async function handleNameChange() {
	if (changeNameInput.value !== '') {
		playerLocalStorageInfo.value.name = changeNameInput.value
	}
}

const isConnected = ref(false)
const isReady = ref(false)
const connectedRoom = ref(null)
const state = ref({})

async function handleCreateRoom() {
  const createRoomName = createRoomInput.value
  if (createRoomName !== '') {
    connectedRoom.value = await client.joinOrCreate('viticulture', {
		  name: createRoomName,
	    playerName: playerLocalStorageInfo.value.name
    })
    onConnect()
  }
  await listRooms()
}

async function handleJoinRoom(e) {
  const roomId = e.target.dataset.roomId

  connectedRoom.value = await client.joinById(roomId, {
    playerName: playerLocalStorageInfo.value.name
  })
  onConnect()
}

function onConnect() {
  console.log(connectedRoom.value.sessionId, "joined", connectedRoom.value.name);
  isConnected.value = true

  connectedRoom.value.state.onChange((e) => {
    console.log('state change', e)
    state.value = null
    state.value = connectedRoom.value.state
  })

  connectedRoom.value.state.players.onAdd((player, sessionId) => {
    player.onChange(() => {
      state.value = null
      state.value = connectedRoom.value.state
      console.log(connectedRoom.value.state.players)
    });
  })
  connectedRoom.value.state.players.onChange((player, sessionId) => {
    console.log('onChange')
  })
  connectedRoom.value.state.chatMessages.onChange(e => {
    console.log('chatMessages onChange', e)
    state.value = null
    state.value = connectedRoom.value.state
  })
}

function handleReady(e) {
  connectedRoom.value.send('ready')
}

async function listRooms() {
  return client.getAvailableRooms()
}

async function handleSendChatMessage(e) {
  console.log(e)
  console.log(chatMessageInput.value)
  if (chatMessageInput.value !== '') {
    connectedRoom.value.send('chat', {message: chatMessageInput.value})
    state.value = null
    state.value = connectedRoom.value.state
  }
}

onMounted(async () => {
  rooms.value = await listRooms()
})
</script>

<style scoped>

</style>
