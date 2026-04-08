# Calendar

Компонент календаря для выбора одной даты или диапазона дат.

## Живые примеры

<ClientOnly>
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(350px, 1fr)); gap: 24px; margin: 24px 0;">
    <!-- Одиночный выбор -->
    <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; ">
      <h4 style="margin: 0 0 12px 0;">📅 Одиночный выбор</h4>
      <Calendar mode="single" v-model="demoSingle" />
      <p style="margin-top: 12px; color: #666; font-size: 14px;">
        Выбрано: <strong>{{ demoSingle ? demoSingle.toLocaleDateString() : '—' }}</strong>
      </p>
    </div>
    <!-- Выбор диапазона -->
    <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; ">
      <h4 style="margin: 0 0 12px 0;">📅 Выбор диапазона</h4>
      <Calendar mode="range" v-model="demoRange" />
      <p style="margin-top: 12px; color: #666; font-size: 14px;" v-if="demoRange.start && demoRange.end">
        Период: {{ formatDate(demoRange.start) }} — {{ formatDate(demoRange.end) }}
      </p>
      <p style="margin-top: 12px; color: #666; font-size: 14px;" v-else>Диапазон не выбран</p>
    </div>
    <!-- Запрет прошлых дат -->
    <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; ">
      <h4 style="margin: 0 0 12px 0;">🚫 Запрет прошлых дат</h4>
      <Calendar mode="single" :restrictions="{ noPast: true }" v-model="demoNoPast" />
      <p style="margin-top: 12px; color: #666; font-size: 14px;">Нельзя выбрать дату раньше сегодня</p>
    </div>
    <!-- Запрет выходных -->
    <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; ">
      <h4 style="margin: 0 0 12px 0;">📅 Запрет выходных</h4>
      <Calendar mode="single" :restrictions="{ disableWeekends: true }" v-model="demoNoWeekends" />
      <p style="margin-top: 12px; color: #666; font-size: 14px;">Суббота и воскресенье недоступны</p>
    </div>
    <!-- Максимум 7 дней -->
    <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; ">
      <h4 style="margin: 0 0 12px 0;">⏱️ Максимум 7 дней</h4>
      <Calendar mode="range" :restrictions="{ maxRangeDays: 7 }" v-model="demoMaxDays" />
      <p style="margin-top: 12px; color: #666; font-size: 14px;">Можно выбрать не более 7 дней подряд</p>
    </div>
    <!-- Кастомная тема -->
    <div style="border: 1px solid #e0e0e0; border-radius: 12px; padding: 20px; ">
      <h4 style="margin: 0 0 12px 0;">🎨 Кастомная тема</h4>
      <Calendar mode="single" class="custom-calendar-demo" v-model="demoCustom" />
    </div>

  </div>
</ClientOnly>

<style>
/* Оставляем здесь, вне ClientOnly */
.custom-calendar-demo {
  --ui-color-primary: #ff6b6b;
  --ui-color-primary-dark: #ff4757;
  --ui-radius-md: 16px;
}
</style>

<script setup>
/* Оставляем здесь, вне ClientOnly */
import { ref } from 'vue'

const demoSingle = ref(null)
const demoRange = ref({ start: null, end: null })
const demoNoPast = ref(null)
const demoNoWeekends = ref(null)
const demoMaxDays = ref({ start: null, end: null })
const demoCustom = ref(null)

const formatDate = (date) => {
  return date ? date.toLocaleDateString('ru-RU') : '—'
}
</script>
