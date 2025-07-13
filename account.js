const updateForm = document.getElementById('updateForm');
const messageDiv = document.getElementById('message');
const deleteBtn = document.getElementById('deleteBtn');

const token = localStorage.getItem('token');

function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch {
    return null;
  }
}

if (!token) {
  messageDiv.textContent = 'You must be logged in to view this page.';
  messageDiv.className = 'error';
  updateForm.style.display = 'none';
  deleteBtn.style.display = 'none';
} else {
  const decoded = parseJwt(token);
  const userId = decoded?.userId;

  if (!userId) {
    messageDiv.textContent = 'Invalid token. Please login again.';
    messageDiv.className = 'error';
    updateForm.style.display = 'none';
    deleteBtn.style.display = 'none';
  } else {
    fetch(`/users/${userId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => res.json())
    .then(data => {
      if (data.username) {
        updateForm.username.value = data.username;
      }
    })
    .catch(() => {});

    updateForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      messageDiv.textContent = '';
      messageDiv.className = '';

      const username = updateForm.username.value.trim();
      const password = updateForm.password.value.trim();

      if (!username || username.length < 3) {
        messageDiv.textContent = 'Username must be at least 3 characters.';
        messageDiv.className = 'error';
        return;
      }

      if (password && password.length < 6) {
        messageDiv.textContent = 'Password must be at least 6 characters.';
        messageDiv.className = 'error';
        return;
      }

      try {
        const response = await fetch(`/users/${userId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if (response.ok) {
          messageDiv.textContent = 'Account updated successfully!';
          messageDiv.className = 'success';
          updateForm.password.value = '';
        } else {
          messageDiv.textContent = data.message || 'Update failed.';
          messageDiv.className = 'error';
        }
      } catch {
        messageDiv.textContent = 'An error occurred. Please try again later.';
        messageDiv.className = 'error';
      }
    });

    deleteBtn.addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;

      messageDiv.textContent = '';
      messageDiv.className = '';

      try {
        const response = await fetch(`/users/${userId}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });

        const data = await response.json();

        if (response.ok) {
          messageDiv.textContent = 'Account deleted successfully.';
          messageDiv.className = 'success';
          localStorage.removeItem('token');
          setTimeout(() => window.location.href = '/login.html', 2000);
        } else {
          messageDiv.textContent = data.message || 'Delete failed.';
          messageDiv.className = 'error';
        }
      } catch {
        messageDiv.textContent = 'An error occurred. Please try again later.';
        messageDiv.className = 'error';
      }
    });
  }
}
