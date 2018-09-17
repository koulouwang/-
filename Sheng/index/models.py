from django.db import models

# Create your models here.
class Heros(models.Model):
    name = models.CharField(max_length=20,verbose_name='姓名')
    xingzuo = models.CharField(max_length=20,verbose_name='星座')
    image = models.ImageField(upload_to='static/upload/goods',null=True, verbose_name='图片')
    isActive = models.BooleanField(verbose_name='是否显示')
    def __str__(self):
        return self.name
    class Meta:
        db_table='heros'
        verbose_name='英雄'
        verbose_name_plural=verbose_name
    def to_dict(self):
        dict = {
            'name':self.name,
            'xingzuo':self.xingzuo,
            'image':self.image,
            'isActive':self.isActive,
        }
        return dict

class Type(models.Model):
    name = models.CharField(max_length=20,verbose_name='名称')
    picture = models.ImageField(upload_to='static/upload/goodstype', null=True, verbose_name='类型图片')
    # 商品类型描述
    desc = models.TextField(verbose_name='商品描述')
    class Meta:
        db_table = 'type'
        verbose_name = '板块名称'
        verbose_name_plural = verbose_name
    def __str__(self):
        return self.name