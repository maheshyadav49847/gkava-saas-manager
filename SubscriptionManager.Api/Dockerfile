FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project files
COPY ["SubscriptionManager.Api/SubscriptionManager.Api.csproj", "SubscriptionManager.Api/"]
COPY ["SubscriptionManager.Application/SubscriptionManager.Application.csproj", "SubscriptionManager.Application/"]
COPY ["SubscriptionManager.Domain/SubscriptionManager.Domain.csproj", "SubscriptionManager.Domain/"]
COPY ["SubscriptionManager.Infrastructure/SubscriptionManager.Infrastructure.csproj", "SubscriptionManager.Infrastructure/"]

# Restore
RUN dotnet restore "SubscriptionManager.Api/SubscriptionManager.Api.csproj"

# Copy all code
COPY . .
WORKDIR "/src/SubscriptionManager.Api"
RUN dotnet build "SubscriptionManager.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "SubscriptionManager.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "SubscriptionManager.Api.dll"]
