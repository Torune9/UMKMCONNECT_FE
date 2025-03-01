<template>
    <recapModal :is-recap="isRecap" :is-finance="isFinance" @close="closeModalRecap" @sendInfo="acceptInfo" />
    <editRecapModal :is-show-update="showUpdate" @close="closeModalUpdate" @sendInfo="acceptInfo"
        :is-update-fin="isUpdateFin" :data-fin="dataFin" />
    <MainLayout>
        <template v-slot:body>
            <section class="p-8 mt-10 relative font-poppins">
                <div class="flex flex-col gap-y-2">
                    <h1 class="w-full text-center text-xl font-poppins font-bold border-b sm:text-2xl">Finance
                        Recapitulation</h1>
                    <div v-if="!user.isEmployee ||  (user.isEmployee && user.userData.role == 'operator' )" class="w-full flex flex-row justify-between items-center">
                        <button @click="showModalRecap" type="button"
                            class="bg-green-600 p-2 font-poppins text-sm rounded font-bold w-28 h-10 text-white hover:bg-green-500 transition-all duration-300">
                            Recap
                        </button>
                        <div class="flex flex-col gap-2 items-end">
                            <div class="flex flex-col text-sm w-full items-end">
                                <label for="date">Choose Date</label>
                                <input v-model="dateReport" type="date" id="date" name="date"
                                    class="text-sm rounded w-fit">
                            </div>
                            <button @click="generateReport" type="button"
                                class="bg-red-600 p-2 font-poppins text-sm rounded font-bold w-40 text-white hover:bg-red-500 transition-all duration-300">
                                <p v-if="!isloading">
                                    Generate Report
                                </p>
                                <p v-else class="animate-spin">
                                    <font-awesome-icon icon="fa-solid fa-spinner" />
                                </p>
                            </button>
                            <small class="text-green-600 w-1/2">{{ message }}</small>
                        </div>
                    </div>
                    <div class="flex flex-col gap-3">
                        <div v-if="info.message" class="flex justify-center">
                            <h1 class="p-[10px] border rounded w-64 text-center relative" :class="[
                                info.type == 'success' ? 'bg-green-200 text-green-800 border-green-900' : 'bg-red-300 text-red-800 border-red-900'
                            ]">
                                <small>{{ info.message }}</small>
                                <button @click="info.message = ''" type="button"
                                    class="absolute -right-1 -top-2 text-red-950">
                                    <font-awesome-icon icon="fa-solid fa-circle-xmark" />
                                </button>
                            </h1>
                        </div>
                        <EasyDataTable :headers="headers" :items="items" :loading="isLoading" :rows-per-page="7"
                            :rows-items="[4, 7]" table-class-name="customize-table" alternating>
                            <template #item-createdAt="{ createdAt }">
                                {{ formatDate(createdAt) }}
                            </template>
                            <template #item-income="{ income }">
                                {{ formatterRupiah.formatPriceToIDR(income) ?? 0 }}
                            </template>
                            <template #item-profit="{ profit }">
                                {{ formatterRupiah.formatPriceToIDR(profit) ?? 0 }}
                            </template>
                            <template #item-expenditure="{ expenditure }">
                                {{ expenditure ? formatterRupiah.formatPriceToIDR(expenditure) : 0 }}
                            </template>
                            <template #item-loss="{ loss }">
                                {{ formatterRupiah.formatPriceToIDR(loss) ?? 0 }}
                            </template>
                            <template #item-information="{ information }">
                                {{ information ? information
                                    : 'information not available' }}
                            </template>
                            <template #item-action="item">
                                <button @click="showUpdateModal(item)" type="button"
                                    class="rounded-md bg-blue-600 hover:bg-slate-800 hover:text-white p-2 text-white">
                                    <font-awesome-icon icon="fa-solid fa-pen-to-square" size="lg" />
                                </button>
                            </template>
                        </EasyDataTable>
                    </div>
                </div>
            </section>
        </template>
    </MainLayout>
</template>

<script setup>
import MainLayout from '@/layout/mainLayout.vue';
import recapModal from '@/components/modal/recapModal.vue'
import editRecapModal from '@/components/modal/editRecapModal.vue'
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { recapStore } from '@/stores/recapStore';
import { storeShop } from '@/stores/storeShop';
import formatterRupiah from '@/service/utils/formatterRupiah';
import { formatDate } from '@/service/utils/formatDate';
import { userStore } from '@/stores/userStore';

const recap = recapStore()
const store = storeShop()
const user = userStore()


const headers = [
    {
        text: 'Date',
        value: 'createdAt'
    },
    {
        text: 'Income',
        value: 'income'
    },
    {
        text: 'Profit',
        value: 'profit'
    },
    {
        text: 'Expenditue',
        value: 'expenditure'
    },
    {
        text: 'Loss',
        value: 'loss'
    },
    {
        text: 'Information',
        value: 'information'
    },
    {
        text: 'Edit',
        value: 'action'
    },
]

const items = computed(() => recap.getDataRecap)

const isRecap = ref(false),
    isFinance = ref(false),
    isLoading = ref(false),
    showUpdate = ref(false),
    isUpdateFin = ref(false),
    dataFin = ref({})

const dateReport = ref('')

const info = reactive({
    message: '',
    type: ''
})

const acceptInfo = ({ message, type }) => {
    return info.message = message, info.type = type
}

const showModalRecap = () => {
    isRecap.value = !isRecap.value
    isFinance.value = !isFinance.value
}
const closeModalRecap = async (data) => {
    isRecap.value = data
    isFinance.value = data
    await getRecapFinance()
}

const showUpdateModal = (data) => {
    showUpdate.value = !showUpdate.value
    isUpdateFin.value = !isUpdateFin.value
    dataFin.value = data
}
const closeModalUpdate = async (data) => {
    showUpdate.value = data
    isUpdateFin.value = data
    await getRecapFinance()
}

const getRecapFinance = async () => {
    isLoading.value = !isLoading.value
    await recap.recapFinance(store.dataStore?.id)
        // .catch(error => {
        //     console.log(error);
        // })
        .finally(() => {
            isLoading.value = !isLoading.value
        })
}


const isloading = ref(false)
const message = ref('')
const generateReport = async () => {
    isloading.value = !isloading.value
    const payload = {
        year: '',
        month: ''
    }
    if (dateReport.value) {
        const date = new Date(dateReport.value);
        payload.year = date.getFullYear();
        payload.month = date.getMonth() + 1;
    }
    await recap.generatePdf(store.dataStore?.id, payload)
        .then((response) => {
            console.log(response);
            const url = window.URL.createObjectURL(new Blob([response], { type: 'application/pdf' }));

            const a = document.createElement('a');
            a.href = url;
            a.download = 'finance_report.pdf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);

            message.value = 'generate report success'

        })
        .catch(error => {
            message.value = 'failed generate report,please choose date before generate report or create first your recap finance'
            console.log(error);

        })
        .finally(() => {
            isloading.value = !isloading.value
        })
}

onMounted(async () => {
    if (store.dataStore.id) {
        await getRecapFinance()
    }
})

watch(() => dateReport.value, () => {
    const date = new Date(dateReport.value)

    console.log(date.getFullYear());
    console.log(date.getMonth());

})
</script>

<style scoped>
.customize-table {
    --easy-table-header-font-size: 16px;
    --easy-table-body-row-font-size: 14px;
    --easy-table-header-background-color: #09500f;
    --easy-table-header-font-color: #ffffffec;
    --easy-table-body-row-height: 48px;

    --easy-table-body-row-font-color: #141E46;
}
</style>