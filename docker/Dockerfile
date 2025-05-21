FROM denoland/deno:2.2.12

# Create working directory
WORKDIR /app

# Copy source
COPY .. .

# Compile the main app
RUN deno cache main.ts

EXPOSE 8000
# Run the apps
CMD ["deno", "run", "--allow-net", "--allow-env", "main.ts"]
