import tempfile
from io import BytesIO

from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
from django.urls import reverse
from PIL import Image
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Category, Product


def build_test_image():
    buffer = BytesIO()
    Image.new("RGB", (16, 16), "blue").save(buffer, format="PNG")
    return SimpleUploadedFile("test.png", buffer.getvalue(), content_type="image/png")


@override_settings(MEDIA_ROOT=tempfile.mkdtemp(prefix="catalog-tests-"))
class CatalogApiTests(APITestCase):
    def setUp(self):
        self.beverages = Category.objects.create(
            name="Beverages", description="Coffee, tea and juices"
        )
        self.snacks = Category.objects.create(
            name="Snacks", description="Sweet and salty snacks"
        )
        self.coffee = Product.objects.create(
            name="Coffee",
            description="Ground coffee",
            price="12.50",
            stock=5,
            category=self.beverages,
        )
        self.chips = Product.objects.create(
            name="Chips",
            description="Potato chips",
            price="4.50",
            stock=20,
            category=self.snacks,
        )

    def test_product_list_includes_nested_category(self):
        response = self.client.get(reverse("catalog:product-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        coffee = next(product for product in response.data if product["id"] == self.coffee.id)
        self.assertEqual(coffee["category"]["name"], "Beverages")
        self.assertEqual(coffee["category"]["description"], "Coffee, tea and juices")
        self.assertNotIn("category_id", coffee)

    def test_product_list_can_be_filtered_by_category(self):
        response = self.client.get(
            reverse("catalog:product-list"), {"category": self.snacks.id}
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([product["id"] for product in response.data], [self.chips.id])

    def test_create_product_with_image(self):
        payload = {
            "name": "Chocolate",
            "description": "Dark chocolate bar",
            "price": "7.90",
            "stock": 12,
            "category_id": self.snacks.id,
            "image": build_test_image(),
        }

        response = self.client.post(
            reverse("catalog:product-list"), payload, format="multipart"
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["category"]["id"], self.snacks.id)
        self.assertTrue(response.data["image_url"])
        product = Product.objects.get(id=response.data["id"])
        self.assertEqual(product.category, self.snacks)
        self.assertTrue(product.image.name)

    def test_update_and_delete_product(self):
        detail_url = reverse("catalog:product-detail", args=[self.coffee.id])

        update = self.client.patch(detail_url, {"price": "15.00"}, format="json")
        self.assertEqual(update.status_code, status.HTTP_200_OK)
        self.coffee.refresh_from_db()
        self.assertEqual(str(self.coffee.price), "15.00")

        delete = self.client.delete(detail_url)
        self.assertEqual(delete.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Product.objects.filter(id=self.coffee.id).exists())
