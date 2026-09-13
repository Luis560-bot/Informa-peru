import unittest
from fastapi.testclient import TestClient
from App.main import app


class RoleFlowTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client_context = TestClient(app)
        cls.client = cls.client_context.__enter__()

    @classmethod
    def tearDownClass(cls):
        cls.client_context.__exit__(None, None, None)

    def login(self, role):
        emails = {
            "Ciudadano": "ciudadano@limpioperu.pe",
            "Operador": "operador@limpioperu.pe",
            "Administrador": "admin@limpioperu.pe",
        }
        response = self.client.post(
            "/api/auth/login", json={"email": emails[role], "password": "Eco2026!"})
        self.assertEqual(response.status_code, 200)
        return {"Authorization": f"Bearer {response.json()['access_token']}"}

    def test_three_roles_and_permissions(self):
        headers = {role: self.login(role) for role in (
            "Ciudadano", "Operador", "Administrador")}
        payload = {"title": "Residuos en parque central", "description": "Hay varias bolsas acumuladas desde ayer",
                   "district": "Miraflores", "address": "Av. Central 120", "category": "Residuos"}
        created = self.client.post(
            "/api/reports", json=payload, headers=headers["Ciudadano"])
        self.assertEqual(created.status_code, 201)
        report_id = created.json()["id"]
        self.assertEqual(self.client.patch(f"/api/reports/{report_id}", json={
                         "status": "En proceso"}, headers=headers["Ciudadano"]).status_code, 403)
        self.assertEqual(self.client.patch(f"/api/reports/{report_id}", json={
                         "status": "En proceso"}, headers=headers["Operador"]).status_code, 200)
        self.assertEqual(self.client.get(
            "/api/users", headers=headers["Operador"]).status_code, 403)
        self.assertEqual(self.client.get(
            "/api/users", headers=headers["Administrador"]).status_code, 200)


if __name__ == "__main__":
    unittest.main()
