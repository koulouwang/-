# -*- coding: utf-8 -*-
# from __future__ import unicode_literals
"""
Created on Fri Sep 14 16:29:37 2018

@author: Python
"""

from selenium import webdriver
from bs4 import BeautifulSoup as bs
from lxml import etree

driver = webdriver.PhantomJS()
num = 0
while 1:
    num+=1
    url = 'http://www.dm5.com/m9865/#ipg'
    a = driver.get(url +str(num))
    
    html = driver.page_source
    parseHtml = etree.HTML(html)
    x = parseHtml.xpath('//img[@id="cp_image"]/@src')
    print(x)
    
    if num ==93:
        break


#while True:
# #    创建解析对象
#
#    soup = bs(driver.page_source, 'lxml')
# #    直接调用方法去查找元素
## 存放所有主播的元素对象
#    names = soup.find_all('span', {"class": "dy-name ellipsis fl"})
#    numbers = soup.find_all('span', {"class": "dy-num fr"})
#    
#    # name,number是一个对象，get_text()
#    for name, number in zip(names, numbers):
#        
#        print('\t观众人数：', number.get_text(), '\t主播名字：', name.get_text())
#
#    if driver.page_source.find('shark-pager-disable'):
#        driver.find_element_by_class_name("shark-pager-next")
#
#    driver.find_element_by_class_name('shark-pager-next').click()
#
#    driver.page_source
