from django.db import models

class Customer(models.Model):
    username= models.CharField(max_length= 250, unique= True)
    password= models.CharField(max_length= 250)
    first_name= models.CharField(max_length= 250)
    last_name= models.CharField(max_length= 250)
    
    
    class Meta:
        db_table= 'customers'
        
    def __str__(self) -> str:
        return self.username
    
class Social(models.Model):
    customer = models.ForeignKey(Customer, on_delete = models.DO_NOTHING)
    account = models.CharField(max_length= 250)
    username = models.CharField(max_length= 250)
    password= models.CharField(max_length= 250)
    url = models.CharField(max_length= 250)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self) -> str:
        return self.account
    
class Log(models.Model):
    social= models.ForeignKey(Social, on_delete= models.DO_NOTHING,
                              related_name= 'logs',
                              related_query_name= 'log')
    created_at= models.DateTimeField(auto_now_add = True)
    
    def __str__(self) -> str:
        return self.social.customer.username