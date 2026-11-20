from rest_framework import viewsets

from .models import Category, Product
from .serializers import CategorySerializer, ProductSerializer


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class ProductViewSet(viewsets.ModelViewSet):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.select_related("category").all()
        category_id = self.request.query_params.get("category")
        if category_id and category_id.isdigit():
            queryset = queryset.filter(category_id=category_id)
        return queryset
