# Al ejecutar `make`, verifica si node_modules existe en cada parte del proyecto.
# Si no están, los instala. Luego, ejecuta los comandos necesarios.

all: install
	npm start

install:
	@test -d node_modules || npm install
	@test -d backend/node_modules || (cd backend && npm install)
	@test -d frontend/node_modules || (cd frontend && npm install)

com: 
	npx tsc

# Limpiar la carpeta dist
clean:
	rm -rf dist

# Para evitar conflictos con archivos que se llamen igual que los comandos
.PHONY: clean all install
