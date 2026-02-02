"use client";
import { CategoryProvider } from "@/context/category";
import { SubcategoryProvider } from "@/context/subcategory";
import { ProductProvider } from "@/context/product";
import { BrandProvider } from "@/context/brand";
import { AttributeProvider } from "@/context/attribute";
import { UserProvider } from "@/context/user";
import { SettingProvider } from "@/context/setting";
import { HeroSliderProvider } from "@/context/heroslider";
import { FaqProvider } from "@/context/faq";

import { PostCategoryProvider } from "@/context/postCategory";
import { PostSubCategoryProvider } from "@/context/postSubCategory";
import { PostProvider } from "@/context/post";
import { MediaSettingsProvider } from "@/context/mediaSetting";
import { PostTagProvider } from "@/context/posttags";

import { StoreSettingsProvider } from "@/context/storeSetting";
import { StoreProductsProvider } from "@/context/storeProduct";
import { PaymentSettingsProvider } from "@/context/storePayment";
import { VisibilityProvider } from "@/context/storeVisibility";
import { EmailSettingsProvider } from "@/context/storeEmails";

import { AccountPrivacyProvider } from "@/context/accountandprivacy";
import { ActivityProvider } from "@/context/activity";
import { AddressProvider } from "@/context/address";
import { CartProvider } from "@/context/cart";
import { OrderProvider } from "@/context/order";
import { TagProvider } from "@/context/productTag";
import { PageProvider } from "@/context/pages";
import { TopCategoriesProvider } from "@/context/topcategory";
import { ComplaintProvider } from "@/context/complaint";
import { UIProvider } from "@/context/uiContext";

export default function ClientProviders({ children }) {
  return (
    <CategoryProvider>
      <SubcategoryProvider>
        <ProductProvider>
          <BrandProvider>
            <AttributeProvider>
              <UserProvider>
                <SettingProvider>
                  <HeroSliderProvider>
                    <FaqProvider>
                      <PostCategoryProvider>
                        <PostSubCategoryProvider>
                          <PostProvider>
                            <MediaSettingsProvider>
                              <PostTagProvider>
                                <StoreSettingsProvider>
                                  <StoreProductsProvider>
                                    <PaymentSettingsProvider>
                                      <VisibilityProvider>
                                        <EmailSettingsProvider>
                                          <AccountPrivacyProvider>
                                            <ActivityProvider>
                                              <AddressProvider>
                                                <CartProvider>
                                                  <OrderProvider>
                                                    <ComplaintProvider>
                                                      <TagProvider>
                                                        <PageProvider>
                                                          <TopCategoriesProvider>
                                                            <UIProvider>
                                                              {children}
                                                            </UIProvider>
                                                          </TopCategoriesProvider>
                                                        </PageProvider>
                                                      </TagProvider>
                                                    </ComplaintProvider>
                                                  </OrderProvider>
                                                </CartProvider>
                                              </AddressProvider>
                                            </ActivityProvider>
                                          </AccountPrivacyProvider>
                                        </EmailSettingsProvider>
                                      </VisibilityProvider>
                                    </PaymentSettingsProvider>
                                  </StoreProductsProvider>
                                </StoreSettingsProvider>
                              </PostTagProvider>
                            </MediaSettingsProvider>
                          </PostProvider>
                        </PostSubCategoryProvider>
                      </PostCategoryProvider>
                    </FaqProvider>
                  </HeroSliderProvider>
                </SettingProvider>
              </UserProvider>
            </AttributeProvider>
          </BrandProvider>
        </ProductProvider>
      </SubcategoryProvider>
    </CategoryProvider>
  );
}
