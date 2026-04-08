// Mission Log — Goal Templates
// GOAL_CATEGORY_META: category display config (colour, icon, label)
// GOAL_TEMPLATES: wizard templates grouped by category
// Loaded before app.js — exposes window globals
window.GOAL_CATEGORY_META = {
  weight:         { label: "Weight",         color: "#f4a823", desc: "Track body weight progress" },
  fitness_streak: { label: "Fitness Streak", color: "#fb923c", desc: "Build consecutive workout days" },
  habit:          { label: "Habit",          color: "#a78bfa", desc: "Build a daily habit" },
  savings:        { label: "Savings",        color: "#34d399", desc: "Hit a savings target" },
  debt:           { label: "Debt Payoff",    color: "#4ade80", desc: "Pay down a balance" },
  custom:         { label: "Custom",         color: "#60a5fa", desc: "Any measurable goal" },
};
window.GOAL_TEMPLATES = {
  weight: [
    { id: "lose_weight", label: "Lose Weight",     fields: { label: "Lose Weight",     direction: "lose" } },
    { id: "gain_weight", label: "Gain Weight",     fields: { label: "Gain Weight",     direction: "gain" } },
    { id: "maintain",    label: "Maintain Weight", fields: { label: "Maintain Weight", direction: "maintain" } },
  ],
  fitness_streak: [
    { id: "workout_streak", label: "Build a Workout Streak", fields: { label: "Workout Streak", targetDays: 30 } },
    { id: "stay_active",    label: "Stay Active",             fields: { label: "Stay Active",    targetDays: 90 } },
    { id: "custom_streak",  label: "Custom Streak Goal",      fields: { label: "",               targetDays: 30 } },
  ],
  habit: [
    { id: "meditate",     label: "Meditate Daily", fields: { label: "Meditate Daily",  habitName: "Meditate",     targetDays: 30 } },
    { id: "read",         label: "Read Daily",     fields: { label: "Read Daily",      habitName: "Read",         targetDays: 30 } },
    { id: "no_junk",      label: "No Junk Food",   fields: { label: "No Junk Food",    habitName: "No junk food", targetDays: 30 } },
    { id: "early_rise",   label: "Wake Up Early",  fields: { label: "Wake Up Early",   habitName: "Wake up early",targetDays: 30 } },
    { id: "custom_habit", label: "Custom Habit",   fields: { label: "",                habitName: "",             targetDays: 30 } },
  ],
  savings: [
    { id: "emergency",   label: "Emergency Fund",     fields: { label: "Emergency Fund",    targetAmount: 10000 } },
    { id: "vacation",    label: "Vacation Fund",       fields: { label: "Vacation Fund",      targetAmount: 3000 } },
    { id: "down_pay",    label: "House Down Payment",  fields: { label: "House Down Payment", targetAmount: 50000 } },
    { id: "custom_save", label: "Custom Savings Goal", fields: { label: "",                   targetAmount: 0 } },
  ],
  debt: [
    { id: "credit_card",  label: "Pay Off Credit Card", fields: { label: "Credit Card Debt", startBalance: 0 } },
    { id: "car_loan",     label: "Pay Off Car Loan",    fields: { label: "Car Loan",         startBalance: 0 } },
    { id: "student_loan", label: "Student Loan",        fields: { label: "Student Loan",     startBalance: 0 } },
    { id: "custom_debt",  label: "Custom Debt",         fields: { label: "",                 startBalance: 0 } },
  ],
  custom: [
    { id: "number_goal", label: "Hit a Number",       fields: { label: "", unit: "",           startValue: 0, targetValue: 100 } },
    { id: "completion",  label: "Complete a Project", fields: { label: "", unit: "% complete",  startValue: 0, targetValue: 100 } },
  ],
};
