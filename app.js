(function () {
    const ACCESS_KEY = '293168ff-ea72-4074-adf1-4da7416fcf8f';
    const API_URL = 'https://api.web3forms.com/submit';

    const openBtn = document.getElementById('open-rsvp-modal');
    const overlay = document.getElementById('rsvp-modal');
    const closeBtn = document.getElementById('close-rsvp-modal');
    const form = document.getElementById('rsvp-form');
    const formView = document.getElementById('rsvp-form-view');
    const successView = document.getElementById('rsvp-success-view');
    const errorEl = document.getElementById('rsvp-error');
    const submitBtn = document.getElementById('rsvp-submit-btn');

    if (!openBtn || !overlay || !form) return;

    function openModal() {
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('modal-open');
        resetForm();
        const nameInput = form.querySelector('#guest-name');
        if (nameInput) nameInput.focus();
    }

    function closeModal() {
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('modal-open');
    }

    function resetForm() {
        form.reset();
        formView.classList.remove('form-hidden');
        successView.classList.add('form-hidden');
        errorEl.textContent = '';
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить ответ';
    }

    function showError(message) {
        errorEl.textContent = message;
    }

    function showSuccess() {
        formView.classList.add('form-hidden');
        successView.classList.remove('form-hidden');
    }

    openBtn.addEventListener('click', openModal);

    closeBtn.addEventListener('click', closeModal);

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) closeModal();
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('is-open')) {
            closeModal();
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();
        showError('');

        const name = form.querySelector('#guest-name').value.trim();
        const attendance = form.querySelector('input[name="attendance"]:checked');

        if (!name) {
            showError('Пожалуйста, укажите ваше ФИО.');
            return;
        }

        if (!attendance) {
            showError('Пожалуйста, выберите, придёте ли вы.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка…';

        const payload = {
            access_key: ACCESS_KEY,
            name: name,
            attendance: attendance.value,
            subject: 'Новый ответ на приглашение — Никах 2026',
            from_name: 'Сайт приглашения Равиль & Аделина'
        };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showSuccess();
            } else {
                showError(data.message || 'Не удалось отправить ответ. Попробуйте ещё раз или напишите нам на почту.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить ответ';
            }
        } catch (err) {
            showError('Ошибка сети. Проверьте интернет и попробуйте снова.');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Отправить ответ';
        }
    });
})();
