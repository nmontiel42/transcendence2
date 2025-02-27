# Se encarga del front y el back a la vez, cuando se agregue dockerfile
# se tendra que separar en contenedores

all:
	if [ ! -d "node_modules" ]; then \
		npm install; \
	fi
	cd backend && npx tsc -p tsconfig.backend.json && \ 
	cd .. && \
	cd frontend && npx tsc -p tsconfig.frontend.json && \
	cd .. && \
	npx @tailwindcss/cli -i ./frontend/style.css -o ./dist/frontend/output.css && \
	npm start

c:
	cd backend & npx tsc -p tsconfig.backend.json
	cd frontend & npx tsc -p tsconfig.frontend.json

s:
	npm start

m:
	npx @tailwindcss/cli -i ./frontend/style.css -o ./dist/frontend/output.css --watch

clean:
	rm -rf dist

# Para evitar conflictos con archivos que se llamen igual que los comandos
.PHONY: clean all m s
