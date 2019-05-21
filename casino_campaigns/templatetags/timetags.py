from django import template
import datetime
register = template.Library()


@register.filter()
def print_timestamp(timestamp):
    #print (timestamp)
    time_now = datetime.datetime.now()
    # print (time_now)
    time_text = str(time_now)
    split_format = ',:.- '

    for x in (split_format):
        temp = time_text.split(x)
        time_text = "".join(temp)
        #print (time_text)
    # print (time_text)
    return time_text

# register.filter('call_time',print_timestamp)