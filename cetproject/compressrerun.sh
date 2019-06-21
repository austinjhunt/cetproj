# Before compressing, go ahead and remove the old compress.* files in the js and css directories. This will force new compression files to be created but we aren't concerned with time here so that's fine.
rm cet/static/cet/js/output.*
rm cet/static/cet/css/output.*
python manage.py compress
# if no argument then just run server
if [ $# -eq 0 ]; then # no argument.
	python manage.py runserver

# otherwise run it at a specfiic ip address for mobile testing
else
	# get IP address
	myIP=$(ifconfig | grep -Eo 'inet (addr:)?([0-9]*\.){3}[0-9]*' | grep -Eo '([0-9]*\.){3}[0-9]*' | grep -v '127.0.0.1')
	if [ "$1" == mobile ]; then
		python manage.py runserver $myIP:8080
	fi
fi
