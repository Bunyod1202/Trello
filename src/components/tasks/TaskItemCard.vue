<template>
  <div v-if="groupedTasks[status]">
    <draggable v-model="groupedTasks[status]" group="tasks" item-key="id" @end="onDragEnd">
      <template #item="{ element }">
        <q-card class="card-section-bg q-mb-sm cursor-pointer p-3" bordered>
          <q-card-section>
            <div class="text-subtitle1">{{ element.title }}</div>
            <p class="text-caption wrap" style="max-width: 300px">{{ element.description }}</p>
            <div class="text-caption text-grey">📅 {{ element.dueDate }}</div>
            <q-btn
              round
              color="primary  float-right "
              size="sm"
              @click="showDialog(element)"
              icon="edit"
            />
          </q-card-section>
        </q-card>
      </template>
    </draggable>
    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-center text-h6">Редактировать задачу</div>
          <q-input
            standout
            v-model="form.title"
            label="Название"
            lazy-rules
            :rules="[(val) => !!val || 'Обязательный']"
          />
          <q-input
            standout
            v-model="form.description"
            label="Описание"
            type="textarea"
            lazy-rules
            :rules="[(val) => !!val || 'Обязательный']"
          />
          <q-input
            standout
            label="Дата завершения"
            v-model="form.dueDate"
            mask="date"
            lazy-rules
            :rules="['date']"
          >
            <template v-slot:append>
              <q-icon name="event" class="cursor-pointer">
                <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                  <q-date v-model="form.dueDate" mask="YYYY/MM/DD" :options="optionFn">
                    <div class="row items-center justify-end">
                      <q-btn v-close-popup label="Close" color="primary" flat />
                    </div>
                  </q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-select
            standout
            v-model="form.status"
            :options="statusOptions"
            label="Статус"
            lazy-rules
            :rules="[(val) => !!val || 'Обязательный']"
          />
        </q-card-section>
        <q-card-section align="right">
          <q-btn flat label="Отмена" @click="resetForm" />
          <q-btn flat label="Сохранять" @click="submitTask" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup>
import { useTaskStore } from 'src/stores/tasks'
import { computed, ref, watch } from 'vue'
import draggable from 'vuedraggable'
import { useQuasar } from 'quasar'
import { useToolsStore } from 'src/stores/tools'

const props = defineProps({
  status: { type: String, required: true },
  tasks: { type: Array, required: true },
})
const $q = useQuasar()
const taskStore = useTaskStore()
const toolsStore = useToolsStore()
const dialog = computed(() => toolsStore.editTaskDialog)
const groupedTasks = computed(() => taskStore.groupedTasks)
const taskId = ref(null)
const status = ref(props.status)
const form = ref({
  id: null,
  title: '',
  description: '',
  dueDate: '',
  status: '',
})
const statusOptions = [
  {
    label: 'Не начато',
    value: 'not_started',
  },
  {
    label: 'В процессе',
    value: 'in_progress',
  },
  {
    label: 'Завершено',
    value: 'done',
  },
]
watch(
  () => props.tasks,
  (newVal) => {
    taskStore.setGroupedTasks(newVal)
  },
  { immediate: true },
)
const resetForm = () => {
  form.value = { id: null, title: '', description: '', dueDate: '', status: '' }
  toolsStore.toggleEditTaskDialog()
}
function formatDateToYMD(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}/${month}/${day}`
}
function optionFn(dateStr) {
  return dateStr >= formatDateToYMD(new Date())
}

const showDialog = (task) => {
  localStorage.setItem('taskId', JSON.stringify(task.id))
  taskId.value = task.id
  toolsStore.toggleEditTaskDialog()
  form.value = { ...task }
}

const submitTask = () => {
  if (!form.value.title || !form.value.dueDate || !form.value.status) {
    $q.notify({ type: 'negative', message: 'Пожалуйста, заполните все обязательные поля.' })
    return
  }
  form.value.status = form.value.status.value
  const taskData = {
    ...form.value,
    id: JSON.parse(localStorage.getItem('taskId')),
  }
  taskStore.setTaskEdit(taskData)
  $q.notify({ type: 'positive', message: '✅ Задача обновлена!' })
  toolsStore.toggleEditTaskDialog()
  form.value = { id: null, title: '', description: '', dueDate: '', status: '' }
}

const onDragEnd = () => {
  taskStore.setChangeTaskStatus(groupedTasks.value)
  $q.notify({ type: 'positive', message: '✅ Статус задачи обновлён!' })
}
</script>

<style lang="scss" scoped>
.card-section-bg {
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.1);
}
</style>
