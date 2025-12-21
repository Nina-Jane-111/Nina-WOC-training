terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0" # This tells it to use version 4.x
    }
  }

backend "azurerm" {
    resource_group_name  = "filevault_resource"
    storage_account_name = "filevaultstorage01"
    container_name       = "vault-data" # The container you created earlier
    key                  = "terraform.tfstate"
    use_oidc             = true
  }
}

provider "azurerm" {
    features {}
}

resource "azurerm_resource_group" "filevault_resource" {
  name     = "filevault_resource"
  location = "uksouth"
}

resource "azurerm_storage_account" "filevaultstorage01" {
  name                     = "filevaultstorage01"
  resource_group_name      = "filevault_resource"
  location                 = "uksouth"
  account_tier             = "Standard"
  account_replication_type = "LRS"
  
  # This matches the "Configuration" blade settings
  min_tls_version           = "TLS1_2"
}

resource "azurerm_storage_container" "filevault_container" {
  name                  = "vault-data"
  storage_account_id  = azurerm_storage_account.filevaultstorage01.id
  container_access_type = "private" # Ensures data isn't public
}

resource "azurerm_container_registry" "acr" {
  # Use a unique name; only letters and numbers allowed
  name                = "filevaultregistry01" 
  resource_group_name = azurerm_resource_group.filevault_resource.name
  location            = azurerm_resource_group.filevault_resource.location
  sku                 = "Basic"
  admin_enabled       = true
}


# Optional: Output the login server URL for your Docker commands
output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "storage_account_name" {
  value     = azurerm_storage_account.filevaultstorage01.name
  sensitive = false 
}

output "storage_account_key" {
  value     = azurerm_storage_account.filevaultstorage01.primary_access_key
  sensitive = true # Keeps the key hidden in GitHub logs
}

output "container_name" {
  value = azurerm_storage_container.filevault_container.name
}