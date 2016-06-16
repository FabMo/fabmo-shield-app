fabmo-shield-app.fma: clean *.html js/*.js js/libs/*.js icon.png package.json
	zip fabmo-shield-app.fma *.html js/*.js js/libs/*.js icon.png package.json

.PHONY: clean

clean:
	rm -rf fabmo-shield-app.fma
