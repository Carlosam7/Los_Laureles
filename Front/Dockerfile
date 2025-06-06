FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Definir las variables de entorno ANTES del build
ENV VITE_SUPABASE_URL=https://faowaewkokjiovwtbrbn.supabase.co
ENV VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZhb3dhZXdrb2tqaW92d3RicmJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgzMTY2MTUsImV4cCI6MjA2Mzg5MjYxNX0.g6-wlY3oR-N1AUVlgA3Wp78hLHOKDcpUzfiZ3LnxON8
# Debug extensivo
RUN echo "=== VERIFICANDO VARIABLES ANTES DEL BUILD ==="
RUN echo "VITE_SUPABASE_URL: $VITE_SUPABASE_URL"
RUN echo "VITE_SUPABASE_ANON_KEY (primeros 20 chars): ${VITE_SUPABASE_ANON_KEY:0:20}..."
RUN env | grep VITE
RUN echo "============================================="

# Verificar archivos .env
RUN echo "=== ARCHIVOS ENV ==="
RUN if [ -f .env ]; then echo "Archivo .env:"; cat .env; fi
#RUN if [ -f .env.production ]; then echo "Archivo .env.production:"; cat .env.production; fi
RUN if [ -f .env.local ]; then echo "Archivo .env.local:"; cat .env.local; fi
RUN echo "==================="

# Construir la aplicación
RUN npm run build

# Verificar que el build generó archivos con las variables
RUN echo "=== VERIFICANDO ARCHIVOS GENERADOS ==="
RUN ls -la dist/
RUN echo "Buscando referencias a supabase en los archivos generados:"
RUN grep -r "supabase" dist/ || echo "No se encontraron referencias a supabase"
RUN echo "======================================"

# Etapa 2: Serve con Nginx
FROM nginx:alpine

# Copiar los archivos construidos
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración de nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Comando para ejecutar nginx
CMD ["nginx", "-g", "daemon off;"]
