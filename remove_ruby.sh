#!/usr/bin/env bash
cat "$1" | perl -pe "s|《.*?》||g" | perl -pe "s|｜||g"

# for f in *.utf8; do echo $f; ../remove_ruby.sh "$f" > ../noruby/"$f".nrb; done