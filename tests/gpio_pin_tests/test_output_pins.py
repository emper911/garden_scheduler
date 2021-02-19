import RPi.GPIO as GPIO
from time import sleep

GPIO.setmode(GPIO.BCM)

sleep(10)
GPIO.setup(17, GPIO.OUT)
print("Pin 17 is HIGH")
GPIO.output(17, GPIO.HIGH)
sleep(10)
print("Pin 17 is LOW")
GPIO.output(17, GPIO.LOW)
print("clean up") 
GPIO.cleanup() # cleanup all GPIO 