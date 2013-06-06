#!/usr/bin/env python

import shutil
import os
import urllib

def base30(num):
    '''
    just return hex for now
    '''
    return hex(num%54294632)[2:]
#     while:
#         
#         num /= 30


mypath = '/Users/lee/Documents/workspace/wordsmashinglive/'
f = open(mypath + "css/ws-min.css", 'rw')
s = f.readline()
hashval = 0
while s != "":
    hashval += hash(s)
    
    s = f.readline()
    #convert to base
newcssname= "css/ws-min"+ base30(hashval) +".css"
f.close()
f = open(mypath + "css/ws-min.css", 'rw')

newf = file(mypath +newcssname, 'w')
newf.write(f.read())
f.close()
newf.close()

f = open(mypath + "js/ws-min.js", 'rw')
s = f.readline()
hashval = 0
while s != "":
    hashval += hash(s)
    
    s = f.readline()
    #convert to base
newjsname= "js/ws-min"+ base30(hashval) +".js"
newf = file(mypath +newjsname, 'w')

f.close()
f = open(mypath + "js/ws-min.js", 'rw')
newf.write(f.read())
newf.close()
f.close()

###########
wsconf = mypath + "ws.py"
shutil.move( wsconf, wsconf+"~" )

destination= file( wsconf, "w" )
source= open( wsconf+"~", "r" )
for line in source:
    if line.find("debug =") > -1:
        destination.write("    debug = False\n")
        continue
    destination.write( line )
    

source.close()
destination.write( "    css = '"+newcssname + "'\n" )
destination.write( "    js = '"+newjsname + "'\n" )
destination.close()

#os.rename( wsconf+"~", wsconf )
######