API Reference
Base URL: http://localhost:8080/api
| Method | Endpoint | Auth | Purpose | | POST | /auth/register | No | Register patient | | POST | /auth/login | No | Login | | GET | /doctors | No | List/search doctors | | GET | /doctors/{id} | No | Doctor details | | POST | /appointments | Patient | Book | | GET | /appointments/my | Patient | Patient history | | PUT | /appointments/{id}/cancel | Patient | Cancel | | GET | /admin/dashboard | Admin | Dashboard counts | | POST | /admin/doctors | Admin | Add doctor | | GET | /admin/appointments | Admin | List appointments |
