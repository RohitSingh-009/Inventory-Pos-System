from utils.dependencies import get_current_user

@router.get("/me")
def current_user(
    user = Depends(get_current_user)
):
    return {
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "role": user.role
    }