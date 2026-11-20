from rest_framework import serializers

from .models import Category, Product


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ("id", "name", "description")


class ProductSerializer(serializers.ModelSerializer):
    # The category is nested in every product so the client needs a single
    # request to render name, price, image and category description.
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        source="category",
        queryset=Category.objects.all(),
        write_only=True,
    )
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = (
            "id",
            "name",
            "description",
            "price",
            "stock",
            "image",
            "image_url",
            "category",
            "category_id",
        )

    def get_image_url(self, obj):
        request = self.context.get("request")
        if obj.image and request is not None:
            return request.build_absolute_uri(obj.image.url)
        return None
