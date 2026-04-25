content = open("frontend/constants/api.ts", "r", encoding="utf-8").read()
content = content.replace(
    "export const API_BASE_URL = 'http://nrjrc2wkj5nf2s5rmgxngesn.178.104.72.151.sslip.io/api';",
    "export const API_BASE_URL = 'http://178.104.72.151:8003/api';"
)
open("frontend/constants/api.ts", "w", encoding="utf-8").write(content)
print("DONE!")
