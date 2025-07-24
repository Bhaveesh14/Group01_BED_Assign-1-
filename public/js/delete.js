const form = document.getElementById('deleteForm');
const message = document.getElementById('message');
const token = localStorage.getItem('token');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const appointmentId = form.appointmentId.value;

  try {
    const res = await fetch(`/appointments/${appointmentId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    if (res.ok) {
      message.textContent = 'Appointment deleted successfully.';
      message.style.color = 'green';
    } else {
      message.textContent = data.message || 'Failed to delete appointment.';
      message.style.color = 'red';
    }
  } catch (err) {
    message.textContent = 'An error occurred.';
    message.style.color = 'red';
  }
});
