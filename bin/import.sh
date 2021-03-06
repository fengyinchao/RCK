#!/bin/bash
# 自动生成 src/index.js 文件内容

set -e

TargetFile='./src/index.js'

if [[ -e $TargetFile ]];then
  rm -rf ./src/index.js
fi

echo -e "import './styles/normalize.scss';\n" >> $TargetFile

file=$(find ./src -name '*.js' ! -name '*.story.js');

export_module='{'
# echo $file
for loop in $file
do
  if [[ $(dirname $loop) != './src' ]];then
    tem=${loop%\/*}
    dir=${tem##*\/}
    right=" from './$dir';"
    export_state=$(grep -E 'export *' $loop)
    left_tmp=${export_state%\}*}
    left=${left_tmp#*\{}
    export_module="$export_module $left,\n"
    final="import {$left} $right"
    echo $final >> $TargetFile
  fi
done

export_module="export ${export_module%,*} }"
echo -e $export_module >> $TargetFile
