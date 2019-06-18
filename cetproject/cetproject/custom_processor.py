# so you dont have to pass 'user' in the context every time you call template in view
def user(request):
    if hasattr(request, 'user'):
        return {'user':request.user }
    return {}