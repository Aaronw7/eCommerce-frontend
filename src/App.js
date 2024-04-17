import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Heading,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  IconButton
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';

function App() {
  const [products, setProducts] = useState([]);
  const toast = useToast();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    axios.get('/api/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  };

  const deleteProduct = (productId) => {
    axios.delete(`/api/products/${productId}`)
      .then(() => {
        toast({
          title: 'Product deleted.',
          description: "The product has been removed from your inventory.",
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        fetchProducts();
      })
      .catch(error => {
        toast({
          title: 'Failed to delete product.',
          description: "There was an issue deleting the product.",
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
        console.error('Error deleting product:', error);
      });
  };

  return (
    <Box className="App" p={3}>
      <Heading mb={2}>Newegg Marketplace</Heading>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Product Name</Th>
            <Th isNumeric>Price</Th>
            <Th>Description</Th>
            <Th isNumeric>Stock</Th>
            <Th>Delete</Th>
          </Tr>
        </Thead>
        <Tbody>
          {products.map(product => (
            <Tr key={product.productId}>
              <Td>{product.productId}</Td>
              <Td style={{ textDecoration: !product.available ? 'line-through' : 'none' }}>{product.productName}</Td>
              <Td isNumeric style={{ textDecoration: !product.available ? 'line-through' : 'none' }}>${product.price.toFixed(2)}</Td>
              <Td style={{ textDecoration: !product.available ? 'line-through' : 'none' }}>{product.description}</Td>
              <Td isNumeric color={product.available ? 'none' : 'red'}>{product.stock}</Td>
              <Td textAlign="center">
                <IconButton
                  aria-label="Delete product"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => deleteProduct(product.productId)}
                />
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
}

export default App;
