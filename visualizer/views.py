from django.http import HttpResponse

def home(request):
	return HttpResponse('<html><body>hi</body></html>')

def dashboard(request):
	return HttpResponse('<html><body>welcome</body></html>')
