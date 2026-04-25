# -*- coding: utf-8 -*-
import json

config = {
    "app_name": "Dom sv. Alzbety - Audio Guide",
    "admin_password": "cathedral2025",
    "languages": [
        {"code": "sk", "name": "Slovencina", "flag": "SK"},
        {"code": "en", "name": "English", "flag": "EN"},
        {"code": "fr", "name": "Francais", "flag": "FR"},
        {"code": "de", "name": "Deutsch", "flag": "DE"},
        {"code": "pl", "name": "Polski", "flag": "PL"},
        {"code": "ru", "name": "Russkiy", "flag": "RU"},
        {"code": "es", "name": "Espanol", "flag": "ES"},
        {"code": "hu", "name": "Magyar", "flag": "HU"},
        {"code": "zh", "name": "Zhongwen", "flag": "ZH"}
    ],
    "tour_routes": {
        "express": {
            "id": "express",
            "name": "Express Tour",
            "description": "Must-see highlights for visitors on the go",
            "icon": "flash",
            "duration": "~45 minutes",
            "stopNumbers": [1, 2, 3, 6, 9, 12, 14],
            "color": "#D4AF37"
        },
        "complete": {
            "id": "complete",
            "name": "Complete Tour",
            "description": "Full sacred journey through all 14 stops",
            "icon": "trophy",
            "duration": "~2 hours",
            "stopNumbers": [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
            "color": "#8B4513"
        },
        "spiritual": {
            "id": "spiritual",
            "name": "Spiritual Journey",
            "description": "Contemplative micro pilgrimage with 432 Hz",
            "icon": "heart",
            "duration": "~1.5 hours",
            "stopNumbers": [1,2,3,5,6,7,9,12,14],
            "color": "#5D4037"
        }
    },
    "ui_theme": {
        "primary_color": "#D4AF37",
        "background_color": "#FDFBF7",
        "card_background": "#FFFFFF",
        "card_background_selected": "#F5F5DC",
        "text_primary": "#2D241E",
        "text_secondary": "#5D5650",
        "accent": "#8B4513",
        "border_color": "#E5E0D8"
    }
}

with open("backend/app_config.json", "w", encoding="utf-8") as f:
    json.dump(config, f, indent=2, ensure_ascii=False)
print("DONE!")
