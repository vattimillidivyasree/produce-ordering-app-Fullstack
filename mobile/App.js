import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || "http://10.0.2.2:5000/api";

const badgeColors = {
  Pending: { backgroundColor: "#fff7dd", color: "#8a6d1d" },
  Confirmed: { backgroundColor: "#e5f3ff", color: "#1f5b92" },
  Delivered: { backgroundColor: "#e7f8ea", color: "#267342" },
};

export default function App() {
  const [screen, setScreen] = useState("login");
  const [authMode, setAuthMode] = useState("login");
  const [token, setToken] = useState("");
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [orderForm, setOrderForm] = useState({ productId: "", quantity: "", deliveryDate: "" });

  useEffect(() => { restoreSession(); }, []);
  useEffect(() => { if (token) { loadProducts(); loadOrders(); } }, [token]);

  const filteredProducts = useMemo(() => {
    if (categoryFilter === "All") return products;
    return products.filter((product) => product.category === categoryFilter);
  }, [products, categoryFilter]);

  const restoreSession = async () => {
    const savedToken = await AsyncStorage.getItem("govigi_token");
    if (savedToken) {
      setToken(savedToken);
      setScreen("products");
    }
  };

  const apiRequest = async (path, options = {}, useAuth = false) => {
    const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
    if (useAuth && token) headers.Authorization = `Bearer ${token}`;
    const response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.message || "Request failed");
    return data;
  };

  const handleAuth = async () => {
    if (authMode === "register" && !authForm.name.trim()) {
      Alert.alert("Validation", "Please enter retailer name.");
      return;
    }

    try {
      const endpoint = authMode === "register" ? "/auth/register" : "/auth/login";
      const payload = authMode === "register" ? authForm : { email: authForm.email, password: authForm.password };
      const response = await apiRequest(endpoint, { method: "POST", body: JSON.stringify(payload) });
      await AsyncStorage.setItem("govigi_token", response.token);
      setToken(response.token);
      setAuthForm({ name: "", email: "", password: "" });
      setScreen("products");
    } catch (error) { Alert.alert("Error", error.message); }
  };

  const loadProducts = async () => {
    try {
      const data = await apiRequest("/products", {}, true);
      setProducts(data);
      setOrderForm((prev) => ({ ...prev, productId: data[0]?._id || "" }));
    } catch (error) { Alert.alert("Error", error.message); }
  };

  const loadOrders = async () => {
    try {
      const data = await apiRequest("/orders", {}, true);
      setOrders(data);
    } catch (error) { Alert.alert("Error", error.message); }
  };

  const placeOrder = async () => {
    if (!orderForm.productId || !orderForm.quantity || !orderForm.deliveryDate) {
      Alert.alert("Validation", "Please fill all order details.");
      return;
    }
    try {
      await apiRequest("/orders", { method: "POST", body: JSON.stringify(orderForm) }, true);
      Alert.alert("Success", "Order placed successfully.");
      setOrderForm((prev) => ({ ...prev, quantity: "", deliveryDate: "" }));
      setScreen("orders");
      loadOrders();
    } catch (error) { Alert.alert("Error", error.message); }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("govigi_token");
    setToken("");
    setOrders([]);
    setProducts([]);
    setScreen("login");
    setAuthMode("login");
  };

  const renderAuthScreen = () => (
    <View style={styles.authContainer}>
      <View style={styles.card}>
        <Text style={styles.title}>{authMode === "register" ? "Create retailer account" : "Retailer login"}</Text>
        <Text style={styles.subtitle}>{authMode === "register" ? "Register to browse products and place orders." : "Login to manage your produce orders."}</Text>
        {authMode === "register" ? <TextInput style={styles.input} placeholder="Retailer name" value={authForm.name} onChangeText={(text) => setAuthForm((prev) => ({ ...prev, name: text }))} /> : null}
        <TextInput style={styles.input} placeholder="Email address" keyboardType="email-address" autoCapitalize="none" value={authForm.email} onChangeText={(text) => setAuthForm((prev) => ({ ...prev, email: text }))} />
        <TextInput style={styles.input} placeholder="Password" secureTextEntry value={authForm.password} onChangeText={(text) => setAuthForm((prev) => ({ ...prev, password: text }))} />
        <TouchableOpacity style={styles.button} onPress={handleAuth}><Text style={styles.buttonText}>{authMode === "register" ? "Register" : "Login"}</Text></TouchableOpacity>
        <TouchableOpacity onPress={() => setAuthMode((prev) => (prev === "register" ? "login" : "register"))}><Text style={styles.linkText}>{authMode === "register" ? "Already have an account? Login" : "New retailer? Register"}</Text></TouchableOpacity>
      </View>
    </View>
  );

  const NavBar = () => (
    <View style={styles.navbar}>
      {[{ key: "products", label: "Products" }, { key: "place-order", label: "Place Order" }, { key: "orders", label: "My Orders" }].map((item) => (
        <TouchableOpacity key={item.key} style={[styles.navButton, screen === item.key && styles.navButtonActive]} onPress={() => setScreen(item.key)}>
          <Text style={[styles.navButtonText, screen === item.key && styles.navButtonTextActive]}>{item.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.logoutButton} onPress={logout}><Text style={styles.logoutText}>Logout</Text></TouchableOpacity>
    </View>
  );

  const renderProductsScreen = () => (
    <View style={styles.contentWrap}>
      <Text style={styles.screenTitle}>Product List</Text>
      <View style={styles.filterRow}>
        {["All", "Vegetable", "Fruit"].map((category) => (
          <TouchableOpacity key={category} style={[styles.filterButton, categoryFilter === category && styles.filterButtonActive]} onPress={() => setCategoryFilter(category)}>
            <Text style={[styles.filterButtonText, categoryFilter === category && styles.filterButtonTextActive]}>{category === "Vegetable" ? "Veg" : category}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <FlatList data={filteredProducts} keyExtractor={(item) => item._id} contentContainerStyle={{ paddingBottom: 40 }} renderItem={({ item }) => (
        <View style={styles.card}><Text style={styles.productName}>{item.name}</Text><Text style={styles.cardText}>{item.category}</Text><Text style={styles.productPrice}>₹{item.price} / {item.unit}</Text></View>
      )} />
    </View>
  );

  const renderPlaceOrderScreen = () => (
    <ScrollView contentContainerStyle={styles.contentWrap}>
      <Text style={styles.screenTitle}>Place Order</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Product</Text>
        {products.map((product) => (
          <TouchableOpacity key={product._id} style={[styles.optionButton, orderForm.productId === product._id && styles.optionButtonActive]} onPress={() => setOrderForm((prev) => ({ ...prev, productId: product._id }))}>
            <Text style={[styles.optionText, orderForm.productId === product._id && styles.optionTextActive]}>{product.name} — ₹{product.price}/{product.unit}</Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.label}>Quantity</Text>
        <TextInput style={styles.input} placeholder="Enter quantity" keyboardType="numeric" value={orderForm.quantity} onChangeText={(text) => setOrderForm((prev) => ({ ...prev, quantity: text }))} />
        <Text style={styles.label}>Delivery date</Text>
        <TextInput style={styles.input} placeholder="YYYY-MM-DD" value={orderForm.deliveryDate} onChangeText={(text) => setOrderForm((prev) => ({ ...prev, deliveryDate: text }))} />
        <TouchableOpacity style={styles.button} onPress={placeOrder}><Text style={styles.buttonText}>Submit order</Text></TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderOrdersScreen = () => (
    <View style={styles.contentWrap}>
      <Text style={styles.screenTitle}>My Orders</Text>
      <FlatList data={orders} keyExtractor={(item) => item._id} ListEmptyComponent={<View style={styles.card}><Text style={styles.cardText}>No orders yet.</Text></View>} renderItem={({ item }) => (
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <Text style={styles.productName}>{item.product?.name}</Text>
            <View style={[styles.statusBadge, { backgroundColor: badgeColors[item.status]?.backgroundColor || "#eee" }]}>
              <Text style={{ color: badgeColors[item.status]?.color || "#333", fontWeight: "700" }}>{item.status}</Text>
            </View>
          </View>
          <Text style={styles.cardText}>Quantity: {item.quantity}</Text>
          <Text style={styles.cardText}>Delivery: {new Date(item.deliveryDate).toLocaleDateString()}</Text>
          <Text style={styles.cardText}>Price: ₹{item.product?.price}/{item.product?.unit}</Text>
        </View>
      )} />
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" />
      {!token ? renderAuthScreen() : <>{NavBar()}{screen === "products" && renderProductsScreen()}{screen === "place-order" && renderPlaceOrderScreen()}{screen === "orders" && renderOrdersScreen()}</>}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: "#f4f7f5" },
  authContainer: { flex: 1, justifyContent: "center", padding: 16 },
  contentWrap: { flexGrow: 1, padding: 16 },
  card: { backgroundColor: "#ffffff", padding: 16, borderRadius: 16, marginBottom: 14, shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 10, shadowOffset: { width: 0, height: 6 }, elevation: 2 },
  title: { fontSize: 24, fontWeight: "700", color: "#1c2b22", marginBottom: 8 },
  subtitle: { fontSize: 14, color: "#5b6b61", marginBottom: 16, lineHeight: 20 },
  screenTitle: { fontSize: 24, fontWeight: "700", marginBottom: 16, color: "#1c2b22" },
  input: { borderWidth: 1, borderColor: "#d4ddd7", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12, backgroundColor: "#fff", marginBottom: 12 },
  button: { backgroundColor: "#1f8f55", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  linkText: { marginTop: 16, color: "#1f8f55", fontWeight: "700", textAlign: "center" },
  navbar: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 12, paddingTop: 12, paddingBottom: 8, backgroundColor: "#f4f7f5" },
  navButton: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: "#fff", borderWidth: 1, borderColor: "#dfe7e2" },
  navButtonActive: { borderColor: "#1f8f55", backgroundColor: "#edf8f1" },
  navButtonText: { color: "#1c2b22", fontWeight: "600" },
  navButtonTextActive: { color: "#1f8f55" },
  logoutButton: { paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12, backgroundColor: "#fff1f0", marginLeft: "auto" },
  logoutText: { color: "#c0392b", fontWeight: "700" },
  filterRow: { flexDirection: "row", gap: 8, marginBottom: 14 },
  filterButton: { backgroundColor: "#fff", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999, borderWidth: 1, borderColor: "#dfe7e2" },
  filterButtonActive: { backgroundColor: "#edf8f1", borderColor: "#1f8f55" },
  filterButtonText: { color: "#1c2b22", fontWeight: "600" },
  filterButtonTextActive: { color: "#1f8f55" },
  productName: { fontSize: 18, fontWeight: "700", color: "#1c2b22", marginBottom: 6 },
  productPrice: { fontSize: 17, fontWeight: "700", color: "#1f8f55" },
  cardText: { color: "#5b6b61", marginBottom: 4 },
  label: { fontWeight: "700", color: "#1c2b22", marginBottom: 8, marginTop: 8 },
  optionButton: { borderWidth: 1, borderColor: "#dfe7e2", backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 8 },
  optionButtonActive: { borderColor: "#1f8f55", backgroundColor: "#edf8f1" },
  optionText: { color: "#1c2b22" },
  optionTextActive: { color: "#1f8f55", fontWeight: "700" },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 8 },
  statusBadge: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 6 },
});
