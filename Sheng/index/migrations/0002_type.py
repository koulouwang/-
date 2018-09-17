# -*- coding: utf-8 -*-
# Generated by Django 1.11.8 on 2018-09-11 03:10
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Type',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=20, verbose_name='名称')),
                ('picture', models.ImageField(null=True, upload_to='static/upload/goodstype', verbose_name='类型图片')),
                ('desc', models.TextField(verbose_name='商品描述')),
            ],
            options={
                'db_table': 'type',
                'verbose_name': '板块名称',
                'verbose_name_plural': '板块名称',
            },
        ),
    ]
