# Al ejecutar `make`, verificamos si node_modules existe, si no, lo instalamos, 
# luego ejecutamos ambos comandos en secuencia: npm run dev y npm start
all:
	@test -d node_modules || npm install
	npm run dev &
	npm start

# Limpiar la carpeta dist
clean:
	rm -r dist

# Para evitar conflictos con archivos que se llamen igual que los comandos
.PHONY: clean all
