import sys, runpy
sys.path.insert(0, r'c:\Users\Shubham\Desktop\Wizard')
sys.path.insert(0, r'c:\Users\Shubham\Desktop\Wizard\venv\Lib\site-packages')
sys.argv=['manage.py','runserver','127.0.0.1:8000','--noreload']
runpy.run_path('manage.py', run_name='__main__')
