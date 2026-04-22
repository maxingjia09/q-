#!/bin/bash

# 构建项目
mvn clean package

# 启动应用
java -jar target/outdoor-club-backend-1.0.0.jar