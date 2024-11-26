from cryptography.fernet import Fernet


secret_key = Fernet.generate_key()

with open('secrit_key.pem', 'wb') as file:
        file.write(secret_key)
        