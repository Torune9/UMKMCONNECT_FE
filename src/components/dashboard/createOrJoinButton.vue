<template>
    <section v-if="closePage" class="flex flex-col p-4 sm:p-8 gap-6 sm:gap-10 justify-center items-center h-screen">
        <h1 class="text-2xl sm:text-3xl text-black/50 font-black font-inter text-center">
            You don't have a store yet
        </h1>
        <div class="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center items-center">
            <div class="relative">
                <button data-tooltip-target="add-store" type="button" @click="showCreateStore"
                    class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-2xl sm:text-4xl px-4 sm:px-5 py-2.5 sm:py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 w-24 sm:w-32 h-12 sm:h-16">
                    <font-awesome-icon icon="fa-regular fa-square-plus" />
                </button>

                <div id="add-store" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-xs sm:text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    Add Store
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
            <div class="relative">
                <button data-tooltip-target="join-store" type="button" @click="showJoinStore"
                    class="text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-2xl sm:text-4xl px-4 sm:px-5 py-2.5 sm:py-3 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800 w-24 sm:w-32 h-12 sm:h-16">
                    <font-awesome-icon icon="fa-solid fa-people-group" />
                </button>

                <div id="join-store" role="tooltip"
                    class="absolute z-10 invisible inline-block px-3 py-2 text-xs sm:text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700">
                    Join Store
                    <div class="tooltip-arrow" data-popper-arrow></div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
const props = defineProps({
    closePage: {
        type: Boolean,
        default: false
    }
})

const emits = defineEmits(['showCreateStore', 'showJoinStore'])

const showCreateStore = () => {
    emits('showCreateStore', true)
}

const showJoinStore = () => {
    emits('showJoinStore', true)
}
</script>
