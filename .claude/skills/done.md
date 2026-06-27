# @done — End of session checklist

Перед коммитом проверь:
1. Все новые эндпоинты защищены JwtAuthGuard
2. Нет console.log и TODO без тикета
3. Тесты написаны и зелёные (npm run test)
4. Нет нарушений FSD импортов
5. DTOs валидируются через class-validator
6. Нет any в TypeScript

Если всё ок — сделай git add -A и закоммить с conventional commit.
Если есть проблемы — перечисли их и не коммить.