"""Load demo categories and products with generated placeholder images."""

import io

from django.core.files.base import ContentFile
from django.core.management.base import BaseCommand
from django.utils.text import slugify
from PIL import Image, ImageDraw

from catalog.models import Category, Product

CATEGORIES = [
    ("Beverages", "Coffee, tea and juices"),
    ("Snacks", "Sweet and salty snacks"),
    ("Bakery", "Fresh bread and pastries"),
]

PRODUCTS = [
    {
        "name": "Espresso Coffee",
        "description": "Roasted coffee beans for espresso",
        "price": "12.50",
        "stock": 40,
        "category": "Beverages",
        "color": (111, 78, 55),
    },
    {
        "name": "Green Tea",
        "description": "Loose leaf green tea",
        "price": "8.00",
        "stock": 60,
        "category": "Beverages",
        "color": (86, 138, 84),
    },
    {
        "name": "Orange Juice",
        "description": "Freshly squeezed orange juice",
        "price": "6.75",
        "stock": 35,
        "category": "Beverages",
        "color": (232, 145, 48),
    },
    {
        "name": "Potato Chips",
        "description": "Thin salted potato chips",
        "price": "4.50",
        "stock": 80,
        "category": "Snacks",
        "color": (214, 174, 74),
    },
    {
        "name": "Salted Pretzels",
        "description": "Crunchy baked pretzels",
        "price": "3.25",
        "stock": 70,
        "category": "Snacks",
        "color": (170, 112, 58),
    },
    {
        "name": "Dark Chocolate",
        "description": "70% cocoa chocolate bar",
        "price": "7.90",
        "stock": 25,
        "category": "Snacks",
        "color": (78, 52, 43),
    },
    {
        "name": "Croissant",
        "description": "Buttery puff pastry croissant",
        "price": "5.00",
        "stock": 20,
        "category": "Bakery",
        "color": (208, 165, 92),
    },
    {
        "name": "Whole Wheat Bread",
        "description": "Whole wheat sourdough loaf",
        "price": "6.20",
        "stock": 15,
        "category": "Bakery",
        "color": (150, 106, 66),
    },
    {
        "name": "Blueberry Muffin",
        "description": "Muffin with fresh blueberries",
        "price": "5.75",
        "stock": 18,
        "category": "Bakery",
        "color": (112, 96, 154),
    },
]


class Command(BaseCommand):
    help = "Creates demo categories and products with generated images."

    def handle(self, *args, **options):
        categories = {}
        for name, description in CATEGORIES:
            category, _ = Category.objects.get_or_create(
                name=name, defaults={"description": description}
            )
            categories[name] = category

        created = 0
        for item in PRODUCTS:
            product, was_created = Product.objects.update_or_create(
                name=item["name"],
                defaults={
                    "description": item["description"],
                    "price": item["price"],
                    "stock": item["stock"],
                    "category": categories[item["category"]],
                },
            )
            if not product.image:
                product.image.save(
                    f"{slugify(item['name'])}.png",
                    self.build_image(item),
                    save=True,
                )
            created += int(was_created)

        self.stdout.write(
            self.style.SUCCESS(
                f"Seed complete: {len(categories)} categories, "
                f"{created} new products, {Product.objects.count()} total products."
            )
        )

    @staticmethod
    def build_image(item):
        image = Image.new("RGB", (640, 480), item["color"])
        draw = ImageDraw.Draw(image)
        draw.rectangle((20, 20, 620, 460), outline=(255, 255, 255), width=4)
        draw.text((40, 240), item["name"], fill=(255, 255, 255))
        buffer = io.BytesIO()
        image.save(buffer, format="PNG")
        return ContentFile(buffer.getvalue())
