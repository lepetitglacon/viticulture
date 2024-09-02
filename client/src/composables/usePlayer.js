import { useStorage } from '@vueuse/core'

const player = useStorage('player', { name: 'hi' })

export default function usePlayer() {
    return {
        player
    }
}