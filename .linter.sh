#!/bin/bash
cd /home/kavia/workspace/code-generation/smartchef-ai-43-b3898ca6/smartchef_ai
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

