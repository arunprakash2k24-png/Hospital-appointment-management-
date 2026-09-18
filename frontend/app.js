/* =========================================================
   SMART HOSPITAL - FRONTEND JAVASCRIPT
   ========================================================= */

const API = "http://localhost:8080/api";

/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const $ = (id) => document.getElementById(id);

const authSection = $("auth");
const appSection = $("app");

const emailInput = $("email");
const passwordInput = $("password");

const regNameInput = $("regName");
const regEmailInput = $("regEmail");
const regPassInput = $("regPass");

const authMsg = $("authMsg");

const welcome = $("welcome");

const specializationInput = $("specialization");
const doctorsContainer = $("doctors");

const doctorIdInput = $("doctorId");
const dateInput = $("date");
const timeInput = $("time");
const reasonInput = $("reason");

const bookingForm = $("bookingForm");
const bookMsg = $("bookMsg");

const appointmentsContainer = $("appointments");


/* =========================================================
   AUTH TOKEN
   ========================================================= */

let token = localStorage.getItem("token");


/* =========================================================
   INITIAL SETUP
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Prevent selecting a previous date
    setMinimumDate();

    if (token) {
        showApp();
        loadDoctors();
        loadAppointments();
    } else {
        showLogin();
    }
});


/* =========================================================
   DATE VALIDATION
   ========================================================= */

function setMinimumDate() {

    if (!dateInput) return;

    const today = new Date();

    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    dateInput.min = `${year}-${month}-${day}`;
}


/* =========================================================
   AUTH HEADERS
   ========================================================= */

function authHeaders() {

    return {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
    };
}


/* =========================================================
   API RESPONSE HANDLER
   ========================================================= */

async function parseResponse(response) {

    const contentType =
        response.headers.get("content-type") || "";

    try {

        if (contentType.includes("application/json")) {
            return await response.json();
        }

        return await response.text();

    } catch {
        return null;
    }
}


/* =========================================================
   ERROR MESSAGE
   ========================================================= */

function getErrorMessage(data, fallback = "Something went wrong.") {

    if (!data) {
        return fallback;
    }

    if (typeof data === "string") {
        return data;
    }

    if (data.message) {
        return data.message;
    }

    if (data.error) {
        return data.error;
    }

    return fallback;
}


/* =========================================================
   LOGIN
   ========================================================= */

async function login() {

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    authMsg.textContent = "";

    if (!email || !password) {

        authMsg.textContent =
            "Please enter email and password.";

        return;
    }

    try {

        const response = await fetch(`${API}/auth/login`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password
            })
        });

        const data = await parseResponse(response);

        if (!response.ok) {

            authMsg.textContent =
                getErrorMessage(data, "Login failed.");

            return;
        }

        if (!data || !data.token) {

            authMsg.textContent =
                "Invalid response from server.";

            return;
        }

        token = data.token;

        localStorage.setItem("token", token);

        showApp();

        welcome.textContent =
            `Welcome, ${data.name || email} (${data.role || "PATIENT"})`;

        clearLoginForm();

        await Promise.all([
            loadDoctors(),
            loadAppointments()
        ]);

    } catch (error) {

        console.error("Login error:", error);

        authMsg.textContent =
            "Cannot connect to the server. Make sure the backend is running.";
    }
}


/* =========================================================
   REGISTER
   ========================================================= */

async function register() {

    const name = regNameInput.value.trim();
    const email = regEmailInput.value.trim();
    const password = regPassInput.value;

    authMsg.textContent = "";

    if (!name || !email || !password) {

        authMsg.textContent =
            "Please fill all registration fields.";

        return;
    }

    if (password.length < 6) {

        authMsg.textContent =
            "Password must contain at least 6 characters.";

        return;
    }

    try {

        const response = await fetch(`${API}/auth/register`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name,
                email,
                password,
                role: "PATIENT"
            })
        });

        const data = await parseResponse(response);

        if (!response.ok) {

            authMsg.textContent =
                getErrorMessage(data, "Registration failed.");

            return;
        }

        authMsg.textContent =
            "Registration successful. You can now login.";

        // Put registered email into login field
        emailInput.value = email;

        // Clear registration fields
        regNameInput.value = "";
        regEmailInput.value = "";
        regPassInput.value = "";

    } catch (error) {

        console.error("Registration error:", error);

        authMsg.textContent =
            "Cannot connect to the server.";
    }
}


/* =========================================================
   LOAD DOCTORS
   ========================================================= */

async function loadDoctors() {

    doctorsContainer.innerHTML =
        `<p class="empty-state">Loading doctors...</p>`;

    const specialization =
        specializationInput.value.trim();

    let url = `${API}/doctors`;

    if (specialization) {

        url +=
            `?specialization=${encodeURIComponent(specialization)}`;
    }

    try {

        const response = await fetch(url);

        const data = await parseResponse(response);

        if (!response.ok) {

            doctorsContainer.innerHTML =
                `<p class="empty-state">
                    ${escapeHTML(
                        getErrorMessage(data, "Unable to load doctors.")
                    )}
                </p>`;

            return;
        }

        if (!Array.isArray(data) || data.length === 0) {

            doctorsContainer.innerHTML =
                `<p class="empty-state">
                    No doctors found.
                </p>`;

            return;
        }

        renderDoctors(data);

    } catch (error) {

        console.error("Doctor loading error:", error);

        doctorsContainer.innerHTML =
            `<p class="empty-state">
                Cannot connect to the server.
            </p>`;
    }
}


/* =========================================================
   RENDER DOCTORS
   ========================================================= */

function renderDoctors(doctors) {

    doctorsContainer.innerHTML = "";

    doctors.forEach((doctor) => {

        const card = document.createElement("div");

        card.className = "doctor";

        const name = escapeHTML(
            doctor.name || "Unknown Doctor"
        );

        const specialization =
            escapeHTML(
                doctor.specialization || "General"
            );

        const qualification =
            escapeHTML(
                doctor.qualification || "N/A"
            );

        const availableDays =
            escapeHTML(
                doctor.availableDays || "N/A"
            );

        const availableTime =
            escapeHTML(
                doctor.availableTime || "N/A"
            );

        card.innerHTML = `
            <h3>👨‍⚕️ ${name}</h3>

            <p>
                <strong>Doctor ID:</strong>
                ${Number(doctor.id) || "N/A"}
            </p>

            <p>
                <strong>Specialization:</strong>
                ${specialization}
            </p>

            <p>
                <strong>Qualification:</strong>
                ${qualification}
            </p>

            <p>
                <strong>Available Days:</strong>
                ${availableDays}
            </p>

            <p>
                <strong>Available Time:</strong>
                ${availableTime}
            </p>

            <button
                type="button"
                class="btn btn-primary"
                data-doctor-id="${Number(doctor.id) || ""}"
            >
                Select Doctor
            </button>
        `;

        const selectButton =
            card.querySelector("button");

        selectButton.addEventListener(
            "click",
            () => selectDoctor(doctor.id)
        );

        doctorsContainer.appendChild(card);
    });
}


/* =========================================================
   SELECT DOCTOR
   ========================================================= */

function selectDoctor(id) {

    doctorIdInput.value = id;

    doctorIdInput.focus();

    bookMsg.textContent =
        `Doctor ${id} selected. Choose your date and time.`;

    // Scroll to booking section
    doctorIdInput.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });
}


/* =========================================================
   BOOK APPOINTMENT
   ========================================================= */

async function book() {

    bookMsg.textContent = "";

    const doctorId =
        Number(doctorIdInput.value);

    const appointmentDate =
        dateInput.value;

    const appointmentTime =
        timeInput.value;

    const reason =
        reasonInput.value.trim();

    /* ---------- Validation ---------- */

    if (!doctorId || doctorId <= 0) {

        bookMsg.textContent =
            "Please select a valid doctor.";

        return;
    }

    if (!appointmentDate) {

        bookMsg.textContent =
            "Please select an appointment date.";

        return;
    }

    if (!appointmentTime) {

        bookMsg.textContent =
            "Please select an appointment time.";

        return;
    }

    if (!reason) {

        bookMsg.textContent =
            "Please enter the reason for your visit.";

        return;
    }

    /* ---------- Prevent past dates ---------- */

    const today =
        new Date().toISOString().split("T")[0];

    if (appointmentDate < today) {

        bookMsg.textContent =
            "You cannot book an appointment for a past date.";

        return;
    }

    try {

        const response = await fetch(
            `${API}/appointments`,
            {
                method: "POST",

                headers: authHeaders(),

                body: JSON.stringify({
                    doctorId,
                    appointmentDate,
                    appointmentTime,
                    reason
                })
            }
        );

        const data =
            await parseResponse(response);

        /* ---------- Token expired ---------- */

        if (response.status === 401 ||
            response.status === 403) {

            handleUnauthorized();

            return;
        }

        if (!response.ok) {

            bookMsg.textContent =
                getErrorMessage(
                    data,
                    "Appointment booking failed."
                );

            return;
        }

        bookMsg.textContent =
            "✓ Appointment booked successfully!";

        clearBookingForm();

        await loadAppointments();

    } catch (error) {

        console.error("Booking error:", error);

        bookMsg.textContent =
            "Cannot connect to the server.";
    }
}


/* =========================================================
   LOAD MY APPOINTMENTS
   ========================================================= */

async function loadAppointments() {

    if (!token) {
        return;
    }

    appointmentsContainer.innerHTML =
        `<p class="empty-state">
            Loading appointments...
        </p>`;

    try {

        const response = await fetch(
            `${API}/appointments/my`,
            {
                method: "GET",
                headers: authHeaders()
            }
        );

        const data =
            await parseResponse(response);

        if (response.status === 401 ||
            response.status === 403) {

            handleUnauthorized();

            return;
        }

        if (!response.ok) {

            appointmentsContainer.innerHTML =
                `<p class="empty-state">
                    ${escapeHTML(
                        getErrorMessage(
                            data,
                            "Unable to load appointments."
                        )
                    )}
                </p>`;

            return;
        }

        if (!Array.isArray(data) ||
            data.length === 0) {

            appointmentsContainer.innerHTML =
                `<p class="empty-state">
                    No appointments yet.
                </p>`;

            return;
        }

        renderAppointments(data);

    } catch (error) {

        console.error(
            "Appointment loading error:",
            error
        );

        appointmentsContainer.innerHTML =
            `<p class="empty-state">
                Cannot connect to the server.
            </p>`;
    }
}


/* =========================================================
   RENDER APPOINTMENTS
   ========================================================= */

function renderAppointments(appointments) {

    appointmentsContainer.innerHTML = "";

    appointments.forEach((appointment) => {

        const card =
            document.createElement("div");

        card.className = "appointment";

        const doctor =
            appointment.doctor || {};

        const doctorName =
            escapeHTML(
                doctor.name || "Unknown Doctor"
            );

        const specialization =
            escapeHTML(
                doctor.specialization || "N/A"
            );

        const appointmentDate =
            escapeHTML(
                appointment.appointmentDate || "N/A"
            );

        const appointmentTime =
            escapeHTML(
                appointment.appointmentTime || "N/A"
            );

        const status =
            escapeHTML(
                appointment.status || "UNKNOWN"
            );

        const reason =
            escapeHTML(
                appointment.reason || "No reason provided"
            );

        card.innerHTML = `
            <h3>👨‍⚕️ ${doctorName}</h3>

            <p>
                <strong>Specialization:</strong>
                ${specialization}
            </p>

            <p>
                <strong>Date:</strong>
                ${appointmentDate}
            </p>

            <p>
                <strong>Time:</strong>
                ${appointmentTime}
            </p>

            <p>
                <strong>Status:</strong>
                ${status}
            </p>

            <p>
                <strong>Reason:</strong>
                ${reason}
            </p>
        `;

        /* ---------- Cancel button ---------- */

        if (appointment.status === "BOOKED") {

            const cancelButton =
                document.createElement("button");

            cancelButton.type = "button";

            cancelButton.className =
                "btn btn-danger";

            cancelButton.textContent =
                "Cancel Appointment";

            cancelButton.addEventListener(
                "click",
                () => cancelAppointment(
                    appointment.id,
                    cancelButton
                )
            );

            card.appendChild(cancelButton);
        }

        appointmentsContainer.appendChild(card);
    });
}


/* =========================================================
   CANCEL APPOINTMENT
   ========================================================= */

async function cancelAppointment(
    id,
    button
) {

    if (!id) {
        return;
    }

    const confirmed =
        window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

    if (!confirmed) {
        return;
    }

    if (button) {

        button.disabled = true;

        button.textContent =
            "Cancelling...";
    }

    try {

        const response = await fetch(
            `${API}/appointments/${id}/cancel`,
            {
                method: "PUT",
                headers: authHeaders()
            }
        );

        const data =
            await parseResponse(response);

        if (response.status === 401 ||
            response.status === 403) {

            handleUnauthorized();

            return;
        }

        if (!response.ok) {

            alert(
                getErrorMessage(
                    data,
                    "Unable to cancel appointment."
                )
            );

            if (button) {
                button.disabled = false;
                button.textContent =
                    "Cancel Appointment";
            }

            return;
        }

        await loadAppointments();

    } catch (error) {

        console.error(
            "Cancel appointment error:",
            error
        );

        alert(
            "Cannot connect to the server."
        );

        if (button) {
            button.disabled = false;
            button.textContent =
                "Cancel Appointment";
        }
    }
}


/* =========================================================
   LOGOUT
   ========================================================= */

function logout() {

    localStorage.removeItem("token");

    token = null;

    showLogin();

    clearAllForms();
}


/* =========================================================
   UNAUTHORIZED / EXPIRED TOKEN
   ========================================================= */

function handleUnauthorized() {

    localStorage.removeItem("token");

    token = null;

    showLogin();

    authMsg.textContent =
        "Your session has expired. Please login again.";
}


/* =========================================================
   SHOW LOGIN
   ========================================================= */

function showLogin() {

    authSection.style.display = "block";

    appSection.style.display = "none";
}


/* =========================================================
   SHOW APPLICATION
   ========================================================= */

function showApp() {

    authSection.style.display = "none";

    appSection.style.display = "block";
}


/* =========================================================
   CLEAR LOGIN FORM
   ========================================================= */

function cle
