#!/usr/bin/env python

import sys
sys.path.append("../../../../tools")
import mergejs

#ATTENZIONE: non terminare con /
sourceDirectory = "../src/scripts"
configFilename = "chartist-devel.cfg"
outputFilename = "chartist-devel.js"

if len(sys.argv) > 1:
    configFilename = sys.argv[1]
    extension = configFilename[-4:]

    if extension  != ".cfg":
        configFilename = sys.argv[1] + ".cfg"

if len(sys.argv) > 2:
    outputFilename = sys.argv[2]

merged = mergejs.run(sourceDirectory, None, configFilename)

file(outputFilename, "w").write(merged)

