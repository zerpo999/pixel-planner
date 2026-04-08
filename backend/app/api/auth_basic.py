from fastapi import APIRouter

router = APIRouter(prefix="/auth_basic", tags=["auth_basic"])

@router.get("/status")
def auth_status():
    return {"auth": "ok"}