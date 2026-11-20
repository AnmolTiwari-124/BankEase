# BankEase – NextGen Net Banking Application

Phase 1 provides the complete Django REST backend. It is an educational banking simulation; no real bank or financial system is connected.

## Architecture

- `backend/config/`: Django settings and root routing
- `backend/users/`: custom email-based user model, authentication, profiles
- `backend/accounts/`: account ownership, balances, account states
- `backend/beneficiaries/`: per-user validated beneficiaries
- `backend/transactions/`: atomic transfer service, idempotency, history
- `backend/notifications/`: user notifications
- `backend/adminpanel/`: dashboard, management APIs, audit logs
- `backend/core/`: shared permissions, pagination, response helpers

## Local setup

```powershell
cd "C:\Users\91844\Desktop\BankEase"
py -m venv .venv
.\.venv\Scripts\Activate.ps1
cd backend
py -m pip install -r requirements.txt
Copy-Item .env.example .env
py manage.py migrate
py manage.py createsuperuser
py manage.py runserver
```

SQLite is used by default. PostgreSQL is selected by setting `DB_ENGINE=postgresql` and the `DB_*` environment variables.

## API summary

- `/api/auth/register/` POST
- `/api/auth/login/` POST
- `/api/auth/refresh/` POST
- `/api/auth/logout/` POST
- `/api/auth/password/change/` POST
- `/api/auth/profile/` GET/PATCH
- `/api/accounts/` GET/POST
- `/api/accounts/<id>/` GET
- `/api/beneficiaries/` GET/POST
- `/api/beneficiaries/<id>/` GET/DELETE
- `/api/transactions/transfer/` POST
- `/api/transactions/` GET
- `/api/transactions/<id>/` GET
- `/api/notifications/` GET
- `/api/notifications/<id>/read/` PATCH
- `/api/notifications/read-all/` POST
- `/api/admin/dashboard/` GET
- `/api/admin/customers/` GET
- `/api/admin/customers/<id>/` GET/PATCH
- `/api/admin/accounts/` GET
- `/api/admin/accounts/<id>/` GET/PATCH
- `/api/admin/transactions/` GET
- `/api/admin/transactions/<id>/` GET
- `/api/admin/audit-logs/` GET

## Authentication

Users login with email and password. Responses contain JWT access and refresh tokens. Send `Authorization: Bearer <access>` to protected APIs. Refresh and logout are supported.

## Transfer safety

Transfers use `transaction.atomic()`, account row locks, ownership and status checks, positive Decimal validation, balance verification, and a database-unique idempotency key. Successful transfers create one transaction plus debit and credit notifications and never partially update balances.

## Tests

```powershell
cd backend
py manage.py test
```

The suite covers registration, login, refresh, profile, password change, logout, account authorization, beneficiaries, successful and invalid transfers, idempotency, history, notifications, and admin permissions.

## Known issues

- The admin and customer APIs use the simulated in-system account balance and do not connect to external banking providers.
- Gunicorn is for Linux/Unix production hosting; use a compatible production server on Windows.
