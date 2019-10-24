.PHONY: html test validate-js-format validate-elm-format lint-js

build: elm-backend elm-client elm-docs tsc editor html

tsc:
	./node_modules/.bin/tsc

elm-backend:
	./node_modules/.bin/elm make src/Analyser.elm --output dist/app/backend-elm.js --optimize

elm-client:
	./node_modules/.bin/elm make src/Client.elm --output dist/public/client-elm.js --optimize

elm-docs:
	./node_modules/.bin/elm make docs/Docs/Main.elm --output docs/docs.js

html:
	node build-html.js
	mkdir -p dist/public/bootstrap
	cp ./node_modules/bootstrap/dist/css/bootstrap.min.css dist/public/bootstrap/bootstrap-v3.3.7.css
	cp ./node_modules/sb-admin-2/dist/css/sb-admin-2.css dist/public/bootstrap/start-bootstrap-admin-2_v3.3.7.css
	mkdir -p dist/public/font-awesome/4.7.0
	cp -rf ./node_modules/font-awesome/css dist/public/font-awesome/4.7.0/
	cp -rf ./node_modules/font-awesome/fonts dist/public/font-awesome/4.7.0/
	# cp -rf ./static/* dist/public/


validate: validate-js-format validate-elm-format lint-js lint-elm

lint-js:
	./node_modules/.bin/eslint js

validate-js-format:
	./prettier-check.sh

lint-elm:
	node ./dist/app/bin/index.js

validate-elm-format:
	./node_modules/.bin/elm-format --validate src/ tests/ docs/

test:
	./node_modules/.bin/elm-test --compiler ./node_modules/.bin/elm-test

clean:
	rm -rf dist
	rm -rf elm-stuff
	rm -rf tests/elm-stuff

editor: tsc
	./node_modules/.bin/elm make src/Editor.elm --output dist/app/editor/elm.js
	mkdir -p dist/public
	node build-editor.js

prepare: prepare-npm

prepare-npm: package.json
	npm install

run:
	node dist/app/bin/index.js

run-server:
	node dist/app/bin/index.js -s

reset-diff:
	git checkout docs/docs.js
	git checkout dist
