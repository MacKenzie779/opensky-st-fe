# API Endpoints Definition

---

## Login

### Request:

- POST

- Parameters:
  
  - username : string
  
  - password: string

### Response:

- Success:
  
  - User { id: number; username: string; }

- Error: 
  
  - Wrong Credentials

---

## Register

### Request:

- POST

- Parameters:
  
  - username : string
  
  - email : string
  
  - password : string

### Response:

- Success:
  
  - User { id: number; username: string; }

- Error:
  
  - User exists
  - Email exists

---

## Change Password

### Request:

- POST

- Parameters:
  
  - username : string
  
  - oldpassword : string
  
  - newpassword : string

### Response:

- Success:
  
  - User { id: number; username: string; }

- Error:
  
  - Oldpwd wrong
