#!/bin/bash

APP_NAME="icid-service"
ENV_TYPE="dev"
ENV_FILE="env"


if [[ -z "$VAULT_ADDR" || -z "$VAULT_USER" || -z "$VAULT_PASS" ]]; then
  echo "Error: VAULT_ADDR, VAULT_USER, or VAULT_PASS is not set."
  exit 1
fi

if [[ -z "$VAULT_TOKEN" || "$VAULT_TOKEN" == "null" ]]; then
  echo "Vault login failed. Check credentials."
  exit 1
fi


fetch_secrets() {
  local vault_path=$1
  local env_file=$2

  echo "Fetching secrets from $vault_path..."

  secrets_json=$(curl -k -s --header "X-Vault-Token: $VAULT_TOKEN" "$VAULT_ADDR/v1/$vault_path")


  echo "$secrets_json" | jq -r '.data.data | to_entries | map("\(.key)=\(.value)") | .[]' > "$env_file"

  echo "Stored secrets in $env_file"
}


#fetch_secrets "apps/data/$ENV_TYPE/$APP_NAME/frontend" "frontend/.$ENV_FILE"
fetch_secrets "apps/data/$ENV_TYPE/$APP_NAME/backend" ".$ENV_FILE"

echo "Secrets fetched and stored successfully."
